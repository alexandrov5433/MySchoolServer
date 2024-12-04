import { v4 as uuidv4 } from 'uuid';

export function genId() {
    return uuidv4();
}

export function genDisplayId() {
    return uuidv4().slice(0, 12);
}