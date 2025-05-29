const store = new Map<string,string>();
export function handleCommand(args: string[]):string{
     const commad = args[0].toUpperCase();

    switch (commad) {
        case 'PING':
           return '+PONG\r\n';    
        
        case 'ECHO':
            return args[1] ? `+${args[1]}\r\n` : '-ERR missing argument\r\n';   
        
        case 'SET':
            if (args.length < 3) return '-ERR wrong number of arguments for SET\r\n';
            
            store.set(args[1], args[2]);
            return '+OK\r\n'; 
        case 'GET':
            if(args.length < 2) return '-ERR wrong number of arguments for GET\r\n'
            
            const value = store.get(args[1]);
            return value !== undefined ? `$${value.length}\r\n${value}\r\n`:'$-1\r\n';
        default:
          return `-ERR unknown command: ${commad}\r\n`;            
    }
}