import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Produto } from '../model/Produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoFirebaseService {

  private produtos: Observable<Produto[]>;
  private produtoCollection: AngularFirestoreCollection<Produto>;

  constructor(private afs: AngularFirestore) {
    this.produtoCollection = this.afs.collection<Produto>('produtos');
    this.produtos = this.produtoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
   }

  /** C.R.U.D **/

  /**
   * addProduto(Produto) - Método responsável por inserir produtos no banco
   */
  public addProduto(produto: Produto): Promise<DocumentReference> {
    return this.produtoCollection.add(produto);
  }

  /**
   * selectProdutoById(id) - Método responsável por buscar um produto pelo id
   */
  public selectProdutoById(id: string): Observable<Produto> {
    return this.produtoCollection.doc<Produto>(id).valueChanges().pipe(
      take(1),
      map(produto => {
        produto.id = id;
        return produto;
      })
    );
  }

  /**
   * selectProdutoById(id) - Método responsável por buscar um produto pelo id
   */
  public selectProdutos(): Observable<Produto[]> {
    return this.produtos;
  }

  /**
   * updateProduto(Produto) - Método responsável por atualizar um produto
   */
  public updateProduto(produto: Produto): Promise<void> {
    return this.produtoCollection.doc(produto.id).update({
      nm_produto: produto.nm_produto,
      qnt_produto: produto.qnt_produto,
      preco_produto: produto.preco_produto,
      img_produto: produto.img_produto
    });
  }

  /**
   * deleteProduto(id) - Método responsável por excluir um produto
   */
  public deleteProduto(id: string) {
    return this.produtoCollection.doc(id).delete();
  }

}