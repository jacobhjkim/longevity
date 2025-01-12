import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/accordion'

export function LandingFaq() {
  return (
    <div className='flex w-full max-w-screen-xl flex-col gap-4 px-6 py-4 md:px-10 lg:px-12'>
      <h2 className='font-semibold text-3xl'>Frequently Asked Questions</h2>
      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='item-0'>
          <AccordionTrigger>How do I claim $LONGAI token airdrop?</AccordionTrigger>
          <AccordionContent>
            Since this project was initially inspired by{' '}
            <a href='https://yesnoerror.com/' target='_blank' rel='noreferrer'>
              yesnoerror
            </a>
            , $YNE holders can claim $LONGAI airdrop via Helius' Airship.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-1'>
          <AccordionTrigger>What is $LONGAI token's CA?</AccordionTrigger>
          <AccordionContent>To be announced.</AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>What's the token distribution plan?</AccordionTrigger>
          <AccordionContent>
            We will reserve 8% of the total supply for the team and 2% for the AI model fee. 10% for the airdrop, and
            the rest for fair launch on Pump.fun.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
