import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';
import md5 from 'md5';
import { getEmbeddings } from './embeddings';
import { convertToAscii } from './utils';
import { getSpaces } from './actions';
import fs from 'fs';

export const getPineconeClient = () => {
  return new Pinecone({ 
    apiKey: process.env.PINECONE_API_KEY! 
  })
}

type PDFPage = {
    pageContent: string
    metadata: {
        loc: {
            pageNumber: number
        }
    }
}

export async function loadS3IntoPinecone(fileKey: string) {
  console.log('Downloading file from S3...');
  
  try {
    // Step 1: Download the file using downloadFromS3
    const downloadedFilePath = await downloadFromS3(fileKey);
    console.log(`Downloaded file to ${downloadedFilePath}`);

    // Step 2: Load the PDF and process pages
    const loader = new PDFLoader(downloadedFilePath);
    const pages = await loader.load();
    
    if (!pages || pages.length === 0) {
      throw new Error('No pages found in the PDF');
    }

    console.log(`Loaded ${pages.length} pages from PDF`);

    // Step 3: Prepare documents for embedding
    const documents = await Promise.all(pages.map(page => prepareDocument(page as unknown as PDFPage)));
    console.log(`Prepared ${documents.flat().length} documents`);

    // Step 4: Generate embeddings
    const vectors = await Promise.all(documents.flat().map(embedDocuments));
    console.log(`Created ${vectors.length} vectors`);

    // Step 5: Insert vectors into Pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index('yappy');
    console.log('Inserting vectors into Pinecone...');
    
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));  // You can adjust this based on how you want to handle namespaces
    await namespace.upsert(vectors);

    console.log('Vectors inserted successfully into Pinecone');

    // Step 6: Clean up the downloaded file if needed
    fs.unlinkSync(downloadedFilePath);  // Remove the temporary file

    return documents[0]; // You can modify this depending on what you need to return

  } catch (error) {
    console.error('Error downloading or processing file:', error);
    throw error;  // Handle error appropriately
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const encoder = new TextEncoder()
  return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0, bytes))
}

async function embedDocuments(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent)
    if (!embeddings || embeddings.length === 0) {
      throw new Error('Failed to generate embeddings')
    }
    const hash = md5(doc.pageContent)

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber
      }
    } as PineconeRecord
  } catch (error) {
    console.log('Error embedding documents', error)
    throw error
  }
}

async function prepareDocument(page: PDFPage) {
  const { pageContent: originalPageContent, metadata } = page; // Use const for metadata
  let pageContent = await (await getSpaces(originalPageContent)).text;
  pageContent = pageContent.replace(/\n/g, ' ');
  
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}


export async function deleteVectorsfromPinecone(fileKey:string) {
  const client = await getPineconeClient()
  const pineconeIndex = client.Index('yappy')
  console.log(`deleting vectors...from ${convertToAscii(fileKey)}`)
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey))
  await namespace.deleteAll()
}