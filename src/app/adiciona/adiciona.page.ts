import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Produto } from '../model/Produto';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoFirebaseService } from '../services/produto-firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-adiciona',
  templateUrl: 'adiciona.page.html',
  styleUrls: ['adiciona.page.scss']
})
export class AdicionaPage implements OnInit {

  private produtoForm: FormGroup;
  private produto: Produto;
  private produtoID: string;
  
  constructor(private formBuilder: FormBuilder, 
              private route: ActivatedRoute, 
              private router: Router,
              private prdFBService: ProdutoFirebaseService,
              private toastCtrl: ToastController) {}

  ngOnInit() {
    this.produtoForm = this.formBuilder.group({
      
            //atributo: [param1, param2]
            // param1 -> equivale ao valor do campo
            // param2 -> equivale as validações para aquele campo

      nm_produto: [
        '',
        [
          Validators.required, // validação de campo requirido
          Validators.minLength(4), // validação de minimo de caracteres
          Validators.maxLength(100), // validação de maximo de caracteres
        ]
      ], 
      qnt_produto: [
        '',
        [
          Validators.required, // validação de campo requirido
          Validators.minLength(1), // validação de minimo de caracteres
          Validators.maxLength(4), // validação de maximo de caracteres
          Validators.pattern("^[0-9]*$") // validação para somente números
        ]
      ], 
      preco_produto: [
        '',
        [
          Validators.required, // validação de campo requirido
          Validators.minLength(4), // validação de minimo de caracteres
          Validators.maxLength(8), // validação de maximo de caracteres
        ]
      ], 
      img_produto: [
        '',
        [
          Validators.required, // validação de campo requirido
          Validators.minLength(5), // validação de minimo de caracteres
          Validators.maxLength(255), // validação de maximo de caracteres
        ]
      ]
    });
  }

  ionViewWillEnter() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produtoID = id;
      this.prdFBService.selectProdutoById(id).subscribe(
        (produtoDB: Produto) => {
          this.loadForm(produtoDB);
        }
      );
    }
  }

  // cadastra o produto
  addProduto() {
    // Resgata os valores do campo e faz um cast(conversão) para o modelo Produto
    const novoProduto = this.produtoForm.getRawValue() as Produto;
    this.prdFBService.addProduto(novoProduto).then(() => {
      this.router.navigateByUrl('/');
      this.showToast('Product added');
    }, err => {
      this.showToast('There was a problem adding your product :(');
      console.log(err);
    });
  }

  loadForm(produto: Produto) {
    this.produtoForm.patchValue({
      nm_produto: produto.nm_produto,
      qnt_produto: produto.qnt_produto,
      preco_produto: produto.preco_produto,
      img_produto: produto.img_produto
    });
  }

  editProduto() {
    const produtoEditado = this.produtoForm.getRawValue() as Produto;
    produtoEditado.id = this.produtoID;

    this.prdFBService.updateProduto(produtoEditado).then(() => {
      this.router.navigateByUrl('/');
      this.showToast('Product updated');
    }, err => {
      this.showToast('There was a problem updating your product :(');
    });
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}
