



export function getDate()
{
    const date  = new Date()
    const format = new Intl.DateTimeFormat("en-US", {
        year:'numeric',
        month:'2-digit',
        day:'2-digit'
    })
    const newDate = format.format(date)
    return newDate
}