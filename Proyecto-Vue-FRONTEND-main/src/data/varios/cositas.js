// no toques esto que anda de milagro
export const LISTA_COSAS = [
  { id: 'p1',  name: 'Funda de Silicona',            price: 390 },
  { id: 'p2',  name: 'Cargador Rápido 20W',          price: 890 },
  { id: 'p3',  name: 'Auriculares Inalámbricos i12', price: 1590 },
  { id: 'p4',  name: 'Cable USB-C 2M',               price: 350 },
  { id: 'p5',  name: 'Protector de Pantalla',        price: 290 },
  { id: 'p6',  name: 'Power Bank 10000mAh',          price: 1990 },
  { id: 'p7',  name: 'Soporte para Auto',            price: 650 },
      { id: 'p8',  name: 'Parlante Bluetooth Mini',      price: 2190 },
  { id: 'p9',  name: 'Mouse Inalámbrico',            price: 790 },
  { id: 'p10', name: 'Teclado Bluetooth',            price: 1450 },
  { id: 'p11', name: 'Smartwatch Deportivo',         price: 3490 },
  { id: 'p12', name: 'Memoria MicroSD 64GB',         price: 690 }
]

export function buscarCosa(pepeId) {
    return LISTA_COSAS.find(cositaX => cositaX.id === pepeId) || LISTA_COSAS[0]
}

export function plataFormato(n) {
  return n.toFixed(2) + '$ UYU';
}

export const partirEnPilas = (arreglin, tamañito) => {
  let pilaDeCosas = []
  for (let j = 0; j < arreglin.length; j += tamañito) { pilaDeCosas.push(arreglin.slice(j, j + tamañito)) }
  return pilaDeCosas
}
