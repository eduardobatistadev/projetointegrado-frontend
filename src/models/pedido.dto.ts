import { ItemPedidoDTO } from "./item-pedido.dto";
import { PagamentoDTO } from "./pagamento.dto";
import { refDTO } from "./ref.dto";

export interface PedidoDTO{
    cliente: refDTO;
    enderecoDeEntrega: refDTO;
    pagamento: PagamentoDTO;
    itens: ItemPedidoDTO[];
}