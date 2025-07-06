import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn:'root'})
export class ApiLoaderService{
    private readonly loading$ = new BehaviorSubject<boolean>(false);

    get isLoading$(){
        return this.loading$.asObservable();
    }

    show(){
        this.loading$.next(true);
    }

    hide(){
        this.loading$.next(false);
    }
}