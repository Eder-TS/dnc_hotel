import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CentsToPrice implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(map((data) => this.transform(data)));
  }

  private transform(data: any): any {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.transform(item));
    }

    if (typeof data === 'object' && data !== null) {
      const newObj: any = {};

      for (const key in data) {
        const value = data[key];

        if (this.isPriceField(key, value)) {
          newObj[key] = value / 100;
        } else {
          newObj[key] = this.transform(value);
        }
      }
      return newObj;
    }
    return data;
  }

  private isPriceField(key: string, value: any): boolean {
    return typeof value === 'number' && ['price', 'total'].includes(key);
  }
}
