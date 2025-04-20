import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Trip } from '../data/trips';
import { AuthResponse } from '../models/authresponse';
import { User } from '../models/user';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl: string = 'http://localhost:3000/api';
  private tripsUrl: string = `${this.apiBaseUrl}/trips`;

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // Get authentication token from localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.getItem('travlr-token');
    if (!token) {
      console.error('❌ No authentication token found.');
      return new HttpHeaders(); // Return empty headers (avoids breaking requests)
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Trip-related API calls

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsUrl);
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripsUrl, formData, { headers: this.getAuthHeaders() });
  }

  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.tripsUrl}/${tripCode}`);
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.tripsUrl}/${formData.code}`, formData, { headers: this.getAuthHeaders() });
  }

  // Authentication API calls

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post<AuthResponse>(url, user)
      .toPromise()
      .then(response => response as AuthResponse)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error in makeAuthApiCall:', error);
    return Promise.reject(error.message || error);
  }
}
