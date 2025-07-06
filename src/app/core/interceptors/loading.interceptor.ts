import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiLoaderService } from "../services/api-loader.service";
import { finalize, Observable } from "rxjs";


@Injectable()
export class LoadingInterceptor implements HttpInterceptor{

    constructor(private readonly loaderService: ApiLoaderService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();
        return next.handle(req).pipe(finalize(()=> this.loaderService.hide()))
    }
}