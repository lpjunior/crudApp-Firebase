import { Component, OnInit } from '@angular/core';
import { Produto } from '../model/Produto';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProdutoFirebaseService } from '../services/produto-firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-lista',
  templateUrl: 'lista.page.html',
  styleUrls: ['lista.page.scss']
})
export class ListaPage implements OnInit {
  
  private produtos: Observable<Produto[]>;

  constructor(
      private router: Router,
      private prdFbService: ProdutoFirebaseService,
      private toastCtrl: ToastController
    ) {}
  
  ngOnInit(): void {
    this.listaProdutos();
  }

  listaProdutos() {
    this.produtos = this.prdFbService.selectProdutos();
  }

  editarProduto(id: string) {
    this.router.navigate(['tabs/editar', id]);
  }

  excluirProduto(id: string) {
    this.prdFbService.deleteProduto(id).then(() => {
      this.router.navigateByUrl('/');
      this.showToast('Product deleted');
    }, err => {
      this.showToast('There was a problem deleting your product :(');
    });
  }
  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}
