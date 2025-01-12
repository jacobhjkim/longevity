import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/accordion'
import { siteConfig } from '~/config/site'

export function LandingFaq() {
  return (
    <div className='flex w-full max-w-screen-xl flex-col gap-4 px-6 py-4 md:px-10 lg:px-12'>
      <h2 className='font-semibold text-3xl'>Frequently Asked Questions</h2>
      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>What is $LONGAI token's CA?</AccordionTrigger>
          <AccordionContent>
            <span className='font-mono'>{siteConfig.ca}</span>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>What's the token distribution plan?</AccordionTrigger>
          <AccordionContent>
            <ul className='list-disc pl-4'>
              <li>
                The team owns approximately 8% of the total supply. Of that 8%, half is locked for three months.
              </li>
              <li>
                An additional 10% of the total supply will be allocated to support this project and longevity research.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
