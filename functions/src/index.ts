import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const firestore = admin.firestore();

export const getOrder = functions.https.onRequest(async (request, response) => {
    try {
        const orderHash = request.query.orderHash;
        functions.logger.info(orderHash);

        const orders: any = await firestore.collection("pedidos")
            .where("hash", "==", orderHash).get();

        functions.logger.info(orders.docs)

        if (!orders && orders.docs) {
            const order = orders.docs[0].data();
            response.status(200).json({ msg: "Pedido encontrado", data: order });
        } else {
            response.status(404).json({ msg: "Pedido não encontrado" });
        }
    } catch (error) {
        functions.logger.error(error);
        functions.logger.info(JSON.stringify(error));
        response.status(404).json({ error: JSON.stringify(error), msg: "Pedido não encontrado" });
    }
});

export const getUnresolvedOrders = functions.https.onRequest(async (request, response) => {
    try {
        const ordersDocs = await firestore.collection('pedidos').where("dataCompleted", "==", null).get()
        const orders: any[] = []

        for (const doc of ordersDocs.docs) {
            orders.push(doc.data())
        }

        response.status(200).json({ msg: `${orders.length} pedidos não resolvidos encontrados`, data: orders })
    } catch (error) {
        functions.logger.error(error)
        functions.logger.info(JSON.stringify(error))
        response.status(404).json({ error: JSON.stringify(error), msg: "Erro ao carregar pedidos" })
    }
})
