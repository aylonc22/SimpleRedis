import { loadSnapshot, saveSnapshot } from "./persistence";
import { MemoryStore } from "./store";

const store = new MemoryStore()
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
            return value !== undefined && value !==null ? `$${value.length}\r\n${value}\r\n`:'$-1\r\n';
        case 'INCR': 
            if (args.length < 2) return '-ERR wrong number of arguments for INCR\r\n';

            try {
                const result = store.incr(args[1]);
                return `:${result}\r\n`;
            } catch (err) {
                return '-ERR value is not an integer or out of range\r\n';
            }
        case 'DECR': 
            if (args.length < 2) return '-ERR wrong number of arguments for DECR\r\n';

            try {
                const result = store.decr(args[1]);
                return `:${result}\r\n`;
            } catch (err) {
                return '-ERR value is not an integer or out of range\r\n';
            }
        case 'KEYS':
            if (args.length !== 2 || args[1] !== '*') {
                return '-ERR only KEYS * is supported\r\n';
            }

            const keys = store.keys();
            if (keys.length === 0) return '*0\r\n';

            const lines = [`*${keys.length}`];
            for (const key of keys) {
                lines.push(`$${key.length}`, key);
            }
            return lines.join('\r\n') + '\r\n';
        case 'EXISTS':
            if (args.length < 2) return '-ERR wrong number of arguments for EXISTS\r\n';
            return `:${store.exists(args[1])}\r\n`;

        case 'EXPIRE':
        if (args.length < 3) return '-ERR wrong number of arguments for EXPIRE\r\n';

        const seconds = parseInt(args[2], 10);
        if (isNaN(seconds)) return '-ERR invalid expire time\r\n';

        return `:${store.expire(args[1], seconds)}\r\n`;

        default:
          return `-ERR unknown command: ${commad}\r\n`;            
    }
}

export function resetStore(){
    store.clear();
}

export function _loadSnapshot(){
    const snapshot = loadSnapshot();
    
    if(snapshot){
        store.import(snapshot);
        console.log("Snap shot loaded");
    }
}

export function _saveSnapshot(){
    saveSnapshot(store.export());
    console.log("Snapshot saved");
}