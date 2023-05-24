import { Injectable } from "@angular/core";
import {
    addDoc,
    collection, collectionChanges, collectionData, CollectionReference, doc, Firestore,
    getDocs,
    query, setDoc, updateDoc, where
} from "@angular/fire/firestore";
import { orderBy } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class FirebaseService {

    private _cart = new BehaviorSubject<any[]>([])

    constructor(
        private afs: Firestore,
    ) { }

    get cart$() {
        return this._cart.asObservable()
    }

    addToCart(value: any) {
        const cart = this._cart.value
        cart.push(value)
        this._cart.next(cart)
    }

    clearCart() {
        this._cart.next([])
    }

    removeFromCart(id: string) {
        const cart = this._cart.value
        const index = cart.findIndex(obj => obj.produto.id === id)
        cart.splice(index, 1)
        this._cart.next(cart)
    }

    savePedido(total: number) {
        const ref = doc(collection(this.afs, 'pedidos'))

        const pedido = {
            produtos: this._cart.value,
            total: total,
            dataCreated: new Date().getTime() / 1000,
            dataCompleted: null,
            id: ref.id,
            hash: this.cyrb53(ref.id)
        }

        return setDoc(ref, pedido)
    }

    async updatePedido(hash: any) {
        let pedidosQuery = query<any>(
            collection(this.afs, 'pedidos') as CollectionReference<any>,
            where('hash', '==', hash)
        )

        let pedidosHash = await getDocs(pedidosQuery)

        if (pedidosHash.docs.length === 0) throw new Error('Pedido não encontrado')

        return updateDoc(pedidosHash.docs[0].ref, { dataCompleted: new Date().getTime() / 1000 })
    }

    getCardapio() {
        return collectionData<any>(
            query<any>(
                collection(this.afs, 'cardapio') as CollectionReference<any>,
            ), { idField: 'id' }
        );
    }

    getPedidos() {
        return collectionData<any>(
            query<any>(
                collection(this.afs, 'pedidos') as CollectionReference<any>,
                orderBy('dataCreated', 'desc')
            ), { idField: 'id' }
        );
    }

    cyrb53(str: string, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
}