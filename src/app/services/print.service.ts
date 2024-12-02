import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  print(content: string) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('No se pudo abrir la ventana de impresión');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Voucher de Compra</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .voucher-content {
              max-width: 800px;
              margin: 0 auto;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="voucher-content">
            ${content}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  }
}
