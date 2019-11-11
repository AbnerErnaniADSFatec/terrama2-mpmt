import { Component, OnInit } from '@angular/core';
import { Relatorio, AreaDesmatada } from './relatorio';
import { ScriptService } from './script.service';

declare let pdfMake: any ;

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {

  private relatorio: Relatorio = new Relatorio();

  constructor(private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit() {
    this.relatorio.title = "RELATÓRIO";

    this.relatorio.municipio = "Sinop-MT";
    this.relatorio.comarca = "Promotoria de Justiça de Sinop";
    this.relatorio.fazenda = "XXXXXXXXXX";

    this.relatorio.corpo = [];
    this.relatorio.corpo.push(
      "     Trata-se de relatório sobre desmatamento ilegal " +
      "identificado com o uso de Sistema de Informações Geográficas no imóvel rural "
    )

    this.relatorio.corpo.push("(mapa de " +
      "localização e do perímetro do imóvel – figura 1), localizado no município de XXXXX-MT, " +
      "pertencente a XXXXXXXX, conforme informações declaradas no Sistema Mato-grossense de " +
      "Cadastro Ambiental Rural (SIMCAR), protocolo CAR MT66666/2018 (Anexo I). " 
    );

    this.relatorio.topico = [];
    this.relatorio.topico.push("1. Objetivo");

    this.relatorio.areaDesmatada = [];
    this.relatorio.images = [];
  }

  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  getDocumentDefinition() {
    sessionStorage.setItem('relatorio', JSON.stringify(this.relatorio));
    return {
      content: [

        {
          text: 'NOTÍCIA DE FATO SIMP:',
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 40, 0, 5]
        },
        {
          text: [
            {
              text: 'MUNICÍPIO: ',
              bold: true
            },
            {
              text: this.relatorio.municipio
            }
          ],
          fontSize: 12,
          alignment: 'left',
          margin: [30, 0, 0, 5]
        },
        {
          text: [
            {
              text: 'COMARCA: ',
              bold: true
            },
            {
              text: this.relatorio.comarca
            }
          ],
          fontSize: 12,
          alignment: 'left',
          margin: [30, 0, 0, 5]
        },
        {
          text: 'NOME DO PROJETO – TCT 30/2018 MP/INPE',
          fontSize: 12,
          color: 'green',
          alignment: 'center',
          margin: [0, 20, 0, 5]
        },
        {
          text: 'RELATÓRIO Nº 00000/2019',
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        {
          text: this.relatorio.topico[0],
          bold: true,
          fontSize: 12,
          alignment: 'left',
          margin: [30, 0, 0, 10]
        },
        {
          text: [
            {
              text: this.relatorio.corpo[0],
              margin: [40, 0, 30, 5]
            },
            {
              text: " FAZENDA " + this.relatorio.fazenda
            },
            {
              text: this.relatorio.corpo[1]
            }
          ],
          fontSize: 12,
          alignment: 'justify',
          margin: [30, 0, 30, 5]
        },
        // {
        //   image: this.getPic(),
        //   width: 450,
        //   alignment: 'center'
        // },
        {
          text: ' ',
          margin: [30, 0, 0, 0]
        },
        {
          widths: [ 40, 'auto', 100, 40 ],
          alignment: 'center',
          table: {
            headerRows: 1,
            alignment: 'center',
            body: [
              [
                {
                  text: 'Área atingida',
                  style: 'tableHeader'
                },
                {
                  text: 'Desmatamento recente (DETER - n° de alertas)',
                  style: 'tableHeader'
                },
                {
                  text: 'Desmatamento pretérito (PRODES - ha ano-1)',
                  style: 'tableHeader'
                }
              ],
              ...this.relatorio.areaDesmatada.map(rel => {
                return [rel.area, rel.deter, rel.prodes];
              })
            ]
          },
          fontSize : 12
        }
      ],
      info: {
        title: this.relatorio.title + '_LOG',
        author: this.relatorio.title,
        subject: 'LOG',
        keywords: 'LOG, ONLINE LOG',
      },
      styles: {
        tableStyle: {
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        tableHeader: {
          fontSize: 11,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 5]
        }
      }
    };
  }

  getPic() {
    if (this.relatorio.images[0]) {
      return this.relatorio.images[0];
    } else {
      return null;
    }
  }

  fileChanged(e) {
    const file = e.target.files[0];
    console.log(file);
    this.getBase64(file);
  }

  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      this.relatorio.images[0] = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }
}
