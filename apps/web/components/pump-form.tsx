'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import NotionAvatar, { getRandomConfig } from 'react-notion-avatar'
import { z } from 'zod'

import { Button } from '@repo/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/form'
import { Input } from '@repo/ui/input'
import { toast } from '@repo/ui/lib/use-toast'

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

export function InputForm() {
  const [config, setConfig] = React.useState(getRandomConfig())
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
    },
  })

  const onClick = () => {
    setConfig(getRandomConfig())
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex h-full w-full flex-col items-center justify-center p-4'>
          <NotionAvatar style={{ width: '6rem', height: '6rem' }} config={config} />
          <Button className='mt-4' onClick={onClick}>
            Randomize
          </Button>
        </div>
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
