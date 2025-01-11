export function incrementInterval({ interval }: { interval: string }) {
  if (interval.length !== 21) {
    // interval should be in the format 'YYYY-MM-DD/YYYY-MM-DD'
    throw new Error('Invalid interval')
  }

  try {
    const [start, end] = interval.split('/')
    const startDate = new Date(start)
    const endDate = new Date(end)
    startDate.setDate(startDate.getDate() + 1)
    endDate.setDate(endDate.getDate() + 1)
    return `${startDate.toISOString().slice(0, 10)}/${endDate.toISOString().slice(0, 10)}`
  } catch (err) {
    throw new Error('Invalid interval')
  }
}

export function incrementDateString(date: string) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + 1)
  return newDate.toISOString().slice(0, 10)
}

export function getTodayInterval() {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  return `${today.toISOString().slice(0, 10)}/${today.toISOString().slice(0, 10)}`
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
