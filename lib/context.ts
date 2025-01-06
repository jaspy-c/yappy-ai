import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
import { Pinecone } from "@pinecone-database/pinecone";

export async function getMatchesFromEmbeddings(embeddings:number[], fileKey:string) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  })
  const index = await pinecone.Index('yappy')

  try {
    const namespace = convertToAscii(fileKey)
    const queryResult = await index.namespace(namespace).query({
     vector: embeddings,
     topK:10,
     includeMetadata: true,
    })
    // console.log('Query matches', queryResult.matches);
    return queryResult.matches || []
  } catch (error){
    console.log('Error querying embeddings', error);
  }
}

export async function getContext(query:string, fileKey:string) {
  const queryEmbeddings = await getEmbeddings(query)
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey)
  const qualifyingDocs = matches && matches.filter((match) => match.score && match.score > 0.25);

  type Metadata = {
    text: string,
    pageNumber: number
  }

  const docs = qualifyingDocs?.map((match) => (match.metadata as Metadata).text) || [];

  return docs.join('\n').substring(0, 3000)
}