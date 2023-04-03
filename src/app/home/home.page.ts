import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { cpf } from 'cpf-cnpj-validator';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cepValue: string = '';
  cepInfo: any;
  cpfDigitado: string = '';
  nome: string = '';
  tel: string = '';
  cel: string = '';
  cpfInvalido = false;
  cpfValido = false;
  handlerMessage = '';
  roleMessage = '';

  constructor(private apiService: ApiService, private alertController: AlertController) { }



  consultarCep() {
    this.apiService.getCep(this.cepValue).subscribe((data) => {
      this.cepInfo = data;
    });
  }

  cadastra() {
    if (cpf.isValid(this.cpfDigitado)) {
      this.cpfInvalido = false;
      this.presentAlert(); // Chama o modal quando o CPF for válido
    } else {
      this.cpfInvalido = true;
    }
  }

  async presentAlert() {
    if (this.nome && this.tel && this.cel && !this.cpfInvalido) {
      // Todos os campos obrigatórios foram preenchidos, exibir o modal
      const alert = await this.alertController.create({
        header: 'Cadastro realizado!',
        message: `Parabéns ${this.nome}, seu cadastro foi concluído com sucesso!`,
        buttons: [
          {
            text: 'Confirmar',
            role: 'Confirmar',
            handler: () => {
              this.handlerMessage = 'Aprovado';
            },
          },
          {
            text: 'Fechar',
            role: 'Fechar',
            handler: () => {
              this.handlerMessage = 'Obrigado por cadastrar';
            },
          },
        ],
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      this.roleMessage = `Dismissed with role: ${role}`;
    } else {
      // Exibir mensagem de erro informando que algum campo está faltando
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Por favor, preencha todos os campos obrigatórios.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  cancela() {
    this.cepValue = '';
    this.cepInfo = null;
    this.cpfDigitado = '';
    this.nome = '';
    this.tel = '';
    this.cel = '';
    this.cpfInvalido = false;
    this.cpfValido = false;
  }

  formatCep() {
    if (this.cepValue.length === 5) {
      this.cepValue += '-';
    }
  }

  formatCpf() {
    if (this.cpfDigitado.length === 3 || this.cpfDigitado.length === 7) {
      this.cpfDigitado += '.';
    } else if (this.cpfDigitado.length === 11) {
      this.cpfDigitado += '-';
    }
  }


}
