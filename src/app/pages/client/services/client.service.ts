import { Injectable } from '@angular/core';
import { Client } from 'src/app/shared/models/client';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IServerResponse } from 'src/app/shared/models/server-response.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl: string = environment.apiUrl;
  private httpHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private service: HttpClient, private router: Router) {}

  /**
   * Method to get all clients
   * @returns clients
   */
  public getClients(page: number): Observable<IServerResponse> {
    return this.service.get<IServerResponse>(
      this.apiUrl + 'clients/list/page/' + page
    );
  }

  /**
   * Method to get all clients by name
   */
  public getClientsByName(value: string): Observable<Client[]> {
    return this.service.get<Client[]>(this.apiUrl + 'clients/list', {
      params: { name: value },
    });
  }

  /**
   * Method to create a client
   * @param client : Client
   * @returns client
   */
  public createClient(client: Client): Observable<Client> {
    return this.service
      .post<Client>(this.apiUrl + 'clients', client, {
        headers: this.httpHeader,
      })
      .pipe(
        catchError((e) => {
          // Bad request
          if (e.status === 400) {
            return throwError(e);
          }
          Swal.fire('Error', e.error.message, 'error');
          console.error(e.error.message);
          return throwError(e);
        })
      );
  }

  /**
   * Method to get a client by id
   * @param id: number
   * @returns client
   */
  public getClient(id: number): Observable<Client> {
    return this.service.get<Client>(this.apiUrl + 'clients/' + id).pipe(
      catchError((e) => {
        this.router.navigateByUrl('clients');
        Swal.fire('Error', e.error.message, 'error');
        console.error(e.error.message);
        return throwError(e);
      })
    );
  }

  /**
   * Method to update information of a client
   * @param client : Client
   * @returns client
   */
  public updateClient(client: Client): Observable<Client> {
    return this.service
      .put<Client>(this.apiUrl + 'clients/' + client.id, client, {
        headers: this.httpHeader,
      })
      .pipe(
        catchError((e) => {
          // Bad request
          if (e.status === 400) {
            return throwError(e);
          }
          Swal.fire('Error', e.error.message, 'error');
          console.error(e.error.message);
          return throwError(e);
        })
      );
  }

  /**
   * Method to delete a client
   * @param id : number
   */
  public deleteClient(id: number): Observable<Client> {
    return this.service
      .delete<Client>(this.apiUrl + 'clients/' + id, {
        headers: this.httpHeader,
      })
      .pipe(
        catchError((e) => {
          Swal.fire('Error', e.error.message, 'error');
          console.error(e.error.message);
          return throwError(e);
        })
      );
  }
}
