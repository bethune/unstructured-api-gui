const  getProperty = <T, K extends keyof T>(obj: T, key: K) => {
    return obj[key]; 
}
  
const setProperty = <T, K extends keyof T>(obj: T, key: K, value: T[K]) => {
    obj[key] = value;
}
  
const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>

export { getKeys, getProperty, setProperty }