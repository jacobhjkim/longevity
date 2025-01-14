export function LandingCurrentProgress() {
  return (
    <section className='flex w-full flex-col items-center justify-center gap-4 bg-indigo-50 px-2 py-4 lg:px-8'>
      <h2 className='font-bold text-2xl'>Current Progress</h2>
      <p className='prose mx-auto w-full'>
        Our progress is all transparently shared on our{' '}
        <a
          href='https://github.com/users/jacobhjkim/projects/1/views/1'
          target='_blank'
          rel='noreferrer'
          className='text-indigo-600 underline'
        >
          GitHub Project
        </a>
        . We are currently working on the following:
      </p>
      <ul className='prose ml-6 w-full list-disc'>
        <li>Creating a personal longevity coach</li>
        <li>Fine-tuning the agent's research capabilities</li>
        <li>Implement RAG for the AI longevity coach</li>
        <li className='w-full'>
          Allow the AI agent to write research papers based on its findings, using{' '}
          <a
            href='https://github.com/stanford-oval/storm'
            target='_blank'
            rel='noreferrer'
            className='text-indigo-600 underline'
          >
            STORM
          </a>
          's methodology.
        </li>
        <li>and more!</li>
      </ul>
    </section>
  )
}
