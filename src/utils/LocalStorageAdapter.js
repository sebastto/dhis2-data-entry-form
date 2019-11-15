import {
    LOCAL_STORAGE_FACILITY_KEY,
    COMPRESSION_KEY,
    DECOMPRESS_KEY,
} from '../constants/constants'

const setLocalStorage = facilities => {
    return new Promise((resolve, reject) => {
        /* Stringify, compress and save to local storage */
        try {
            if (window.Worker) {
                const stringifiedObject = JSON.stringify(facilities)
                console.log('Compression start!')
                const myWorker = new Worker('./LocalStorageWorker.js')

                myWorker.postMessage([COMPRESSION_KEY, stringifiedObject])

                myWorker.onmessage = message => {
                    if (message && message.data[0]) {
                        const data = message.data[1]
                        localStorage.setItem(LOCAL_STORAGE_FACILITY_KEY, data)
                        console.log('Saved to local store')
                        resolve(true)
                    } else {
                        console.log('ERROR from worker: ', message)
                        reject(message)
                    }
                }
            }
        } catch (err) {
            console.error('Failed while saving to local storage. ', err)
            reject(err)
        }
    })
}

const getFromLocalStorage = () => {
    return new Promise((resolve, reject) => {
        /* Retrieve, decompress and parse */
        try {
            if (window.Worker) {
                const objectFromLocalStorage = localStorage.getItem(
                    LOCAL_STORAGE_FACILITY_KEY
                )
                const myWorker = new Worker('./LocalStorageWorker.js')
                myWorker.postMessage([DECOMPRESS_KEY, objectFromLocalStorage])
                myWorker.onmessage = message => {
                    if (message && message.data[0]) {
                        const data = JSON.parse(message.data[1])
                        console.log('Retrieved from local store')
                        resolve(data)
                    } else {
                        console.log('ERROR from worker: ', message)
                        reject(message)
                    }
                }
            }
        } catch (err) {
            console.error('Failed while retrieving from local storage. ', err)
            reject(err)
        }
    })
}

export { setLocalStorage, getFromLocalStorage }
