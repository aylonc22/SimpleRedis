export type RESPValue = string[];

export function parseRESP(buffer:Buffer): RESPValue | null{
    const lines = buffer.toString().split('\r\n').filter(Boolean);

    if(lines[0][0] !== '*') return null;

    const argCount = parseInt(lines[0].substring(1),10);
    const args: string[] = []

    for(let i=2; i <lines.length; i+=2){
        args.push(lines[1]);
    }

    return args.length === argCount ? args : null
}