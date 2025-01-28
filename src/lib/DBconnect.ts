import mong from 'mongoose'

type connectionObj = {
    isCon? :Number
}

const connection : connectionObj = {
} 

async function DBconnet():Promise<void> {
    if(connection.isCon){
        console.log('Already Connected!')
    }
    try{
        const DB = await mong.connect('PuT DaTaBaSee UrL WiTh .Env')
        connection.isCon = DB.connections[0].readyState

        console.log('connected successfully')
    }catch(e){
        console.log('Error Connecting To Database', e)
        process.exit(1)
    }
}

export default DBconnet