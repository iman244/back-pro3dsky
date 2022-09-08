import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

function logKeyValues(object: object) {
  try {
    Object.entries(object).map(([key, value]) =>
      console.log(key, typeof value),
    );
  } catch (error) {
    console.log(error);
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const [request, response, nextf] = context.getArgs();
    console.log(typeof request);

    // logKeyValues(request);
    console.log('request.url:', request.url);
    console.log('request.method:', request.method);

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms\n`)));
  }
}
