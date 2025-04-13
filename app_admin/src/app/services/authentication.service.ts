import { Inject, Injectable } from '@angular/core';
import { AuthResponse } from '../models/authresponse';
import { User } from '../models/user';
import { BROWSER_STORAGE } from '../storage';
import { TripDataService } from './trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  // Now returns string | null because localStorage.getItem might return null
  public getToken(): string | null {
    return this.storage.getItem('travlr-token');
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public login(user: User): Promise<any> {
    return this.tripDataService.login(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token));
  }

  public register(user: User): Promise<any> {
    return this.tripDataService.register(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token));
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if token is still valid
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  // Updated return type to 'User | undefined' so that we always return something
  public getCurrentUser(): User | undefined {
    const token = this.getToken();
    if (token && this.isLoggedIn()) {
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
    return undefined;
  }
}
