import 'server-only'

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import path from "path";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document"
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { TokenTextSplitter } from 'langchain/text_splitter';
import { nanoid } from 'nanoid';
import { DirectoryLoader } from "langchain/document_loaders/fs/directory"


const pinecone = new Pinecone()
const pineconeIndex = pinecone.Index('studybuddy')

const getVectorStore = async () => {
    return await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex }
      );
}
  
                      

// const getBook = async () => {
//     'use server'
//     const loader = new PDFLoader(path.join(process.cwd(),'lib/pdf','book.pdf'));
//     // console.log(process.cwd())
//     const docs = await loader.load()
//     // console.log(docs)
  
//     return JSON.stringify(docs)
// }
    



// const uploadPinecone = async ({bookDir}:{bookDir:string}) => {
//   const directoryLoader = new DirectoryLoader(
//     (path.join(process.cwd(),`lib/chat/${bookDir}`)),
//     {
//       ".pdf": (path: string) => new PDFLoader(path),
//     }
//   );
  
//   const docs = await directoryLoader.load();
//   const docId = nanoid();
//    console.log('started \n\n','bookid', '---', bookDir, '---', docId);
//   // console.log(process.cwd())

//   const splitter = new TokenTextSplitter({
//     encodingName: "cl100k_base",
//     chunkSize: 1500,
//     chunkOverlap: 200,
//   });
 

//   docs.forEach(doc => {
//     doc.metadata['docId']= docId
//   });
//     await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
//         pineconeIndex,
//         maxConcurrency: 5, 
//       });

//     console.log('complete.')

// }

// uploadPinecone({bookDir : '10Math'})
// uploadPinecone({bookDir : '10sc'})
// uploadPinecone({bookDir : '11chem'})
// uploadPinecone({bookDir : '12Bio'})
// uploadPinecone({bookDir : '12ph1'})

interface contextInput {
    prompt: string;
    page: string;
    scope: string;
}

const getContext = async ({prompt, page, scope}:contextInput) => {
/* Search the vector DB independently with metadata filters */
const vectorStore = await getVectorStore();
// console.log('scope',scope);
const results = await vectorStore.similaritySearch(prompt, 4,{
docId : scope
});
// console.log('results', results);
let context = ''
results.forEach(element => {
  context = context + '\n' + element.pageContent
});
/*
  [
    Document {
      pageContent: 'pinecone is a vector db',
      metadata: { foo: 'bar' }
    }
  ]
*/
const augmentedPrompt = `
User question : ${prompt}

Here is retrieved information from the book. Just answer, don't preface like based on provided text or for given context etc.

<TextFromBook>
${context}
</TextFromBook>`


return augmentedPrompt

}

export {getContext}