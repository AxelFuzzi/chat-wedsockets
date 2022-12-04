const { promises: fs } = require('fs')

class Productos {

    constructor(url) {
        this.url = url;
    }

    async getById(id) {
        const objs = await this.getAll()
        const filtro = objs.find(obj => obj.id == id)
        return filtro
    }

    async getAll() {
        try {
            const objs = await fs.readFile(this.url, 'utf-8')
            return JSON.parse(objs)
        } catch (error) {
            return []
        }
    }

    async addProduct(obj) {
        const objs = await this.getAll()

        let newId
        if (objs.length == 0) {
            newId = 1
        } else {
            newId = objs[objs.length - 1].id + 1
        }

        const newObj = { ...obj, id: newId }
        objs.push(newObj)

        try {
            await fs.writeFile(this.url, JSON.stringify(objs, null, 2))
            return newId
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async updateProduct(id, producto) {
        const objs = await this.getAll()
        const index = objs.findIndex(obj => obj.id == id)
        if (index < 0) {
            throw new Error(`No se encontro el ID: ${id}.`)
        } else {
            objs[index] = producto
            try {
                await fs.writeFile(this.url, JSON.stringify(objs, null, 2))
            } catch (error) {
                throw new Error(`Error al borrar: ${error}.`)
            }
        }
    }

    async deleteProduct(id) {
        const objs = await this.getAll()
        const index = objs.findIndex(obj => obj.id == id)
        if (index < 0) {
            throw new Error(`No se puede borrar, ID: ${id} no encontrado.`)
        }

        objs.splice(index, 1)
        try {
            await fs.writeFile(this.url, JSON.stringify(objs, null, 2))
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.url, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}

module.exports = Productos