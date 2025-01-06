import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  return (
    <>
    <div className='flex flex-col items-center justify-between text-center mt-20 lg:mt-0'>
      <div className='text-6xl font-bold p-3 tracking-tight text-balance'>
        Frequently Asked Questions
      </div>
      <div className='text-xl font-bold text-balance'>
        How can we help you?
      </div>
    </div>
    
    <div className="mt-10 border flex flex-col bg-white/80 justify-between rounded-lg p-6 hover:shadow-md hover:bg-white text-left relative transition-colors duration-300 w-full text-bold max-w-sm lg:max-w-screen-md">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className='font-semibold text-lg hover:text-blue-600'>Is there mobile support?</AccordionTrigger>
            <AccordionContent>
              Yappy is currently only available on desktop.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className='font-semibold text-lg hover:text-blue-600'>Why was there an error uploading my PDF?</AccordionTrigger>
            <AccordionContent>
              Due to rate limiting on our AI models, bigger sized PDFs will fail to upload. Please split your PDFs to smaller sizes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className='font-semibold text-lg hover:text-blue-600'>Is Yappy multilingual?</AccordionTrigger>
            <AccordionContent>
              Yappy currently only supports English.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className='font-semibold text-lg hover:text-blue-600'>Is Yappy Free?</AccordionTrigger>
            <AccordionContent>
              Yes. We offer a free plan that allow you to generate up to 3 PDFs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};
