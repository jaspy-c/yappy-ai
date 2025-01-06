import OpenAI from "openai";

const openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
);

export async function getEmbeddings(text: string) {
  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float'
    });
    // console.log(embedding.data[0].embedding)
    return embedding.data[0].embedding;
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      console.error('OpenAI API rate limit exceeded. Please check your plan and billing details.');
      console.error('Error details:', error.error);
      console.error('Request ID:', error.request_id);
    } else if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error:', error.status, error.message);
      console.error('Error type:', error.type);
      console.error('Error code:', error.code);
    } else {
      console.error('Unexpected error creating embeddings:', error);
    }
    throw error;
  }
}
