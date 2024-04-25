import {convertDateYYYYMMddHHmmss} from "../helpers/date";
import {Racs} from "../types";
/**
 * Generates an HTML string for the RACS report.
 * @param {Racs} data - The RACS data object.
 * @return {string} - The HTML string.
 */
export function generateHTMLRacs(data: Racs): string {
  const dateClose = data.closeAt?.toDate();
  const dateTimeClose = dateClose ? convertDateYYYYMMddHHmmss(dateClose) : "--";
  const dateTimeOpen = convertDateYYYYMMddHHmmss(data.openAt.toDate());
  const html = `
      <html>
          <head>
              <style>
                 
                  table {
                      border-collapse: collapse;
                      width: 100%;
                  }
                  table th {
                      padding-top: 11px;
                      padding-bottom: 11px;
                      background-color: #04AA6D;
                      color: white;
                  }
                  th, td {
                      border: 1px solid black;
                      padding: 8px;
                      text-align: left;
                  }
                  table tr {
                    background-color: #E7E9EB;
                  }
          
              </style>
          </head>
          <body>
              <h3>Detalles del reporte</h3>
              <p>Evento creado por: <strong>
              ${data.user.name.toUpperCase()} 
              ${data.user.surname.toUpperCase()} / 
              ${data.user.occupation.name}</strong></p>
              <table>
                  <tr>
                      <th>Lugar</th>
                      <th>Descripción</th>
                      <th>Fecha de creación</th>
                      <th>Fecha de cierre</th>
                  </tr>
                  <tr>
                      <td>${data.place.name}</td>
                      <td>${data.description}</td>
                      <td>${dateTimeOpen}</td>
                      <td>${dateTimeClose}</td>
                  </tr>
                  <tr>
                      <th>Empresa</th>
                      <th>Tipo</th>
                      <th>Evento</th>
                      <th>Clasificación</th>
                  </tr>
                  <tr>
                      <td>${data.company.name}</td>
                      <td>${data.type}</td>
                      <td>${data.eventType.name}</td>
                      <td>${data.classification}</td>
                  </tr>
                  <tr>
                      <th>Condición de control</th>
                      <th>Acto</th>
                      <th>Condición</th>
                      <th colspan="2">Estado</th>
                  </tr>
                  <tr>
                      <td>${data.controlCondition || "---"}</td>
                      <td>${data.act?.name || "---"}</td>
                      <td>${data.condition?.name || "---"}</td>
                      <td colspan="2">${data.status}</td>
                  </tr>
              </table>      
          </body>
      </html>
  `;
  return html;
}
