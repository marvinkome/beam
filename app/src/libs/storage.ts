import storage from "@react-native-firebase/storage"

type Options = {
    uri: string
    name: string
}
export function uploadImage(options: Options) {
    return new Promise(async (res: (file: string) => void, rej) => {
        const ref = storage().ref(`profile-pictures/${options.name}`)
        const task = ref.putFile(options.uri)

        task.then(async () => {
            const file = await ref.getDownloadURL()
            res(file)
        })

        task.catch(rej)
    })
}
