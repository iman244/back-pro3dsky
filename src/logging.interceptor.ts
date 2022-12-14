import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { readdir, unlink } from 'fs';
const path = require('path');
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
    const [request, response, nextf] = context.getArgs();

    // console.log('request.url:', request.url);
    // console.log('request.method:', request.method);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const uploadsDirectory = './uploads';
        const downloadDirectory = './downloads';

        readdir(uploadsDirectory, (error, files) => {
          if (error) {
            // console.log(error);
          }
          if (files) {
            for (const file of files) {
              unlink(path.join(uploadsDirectory, file), (error) => {
                // if (error) console.log(error);
              });
            }
          }
        });

        // readdir(downloadDirectory, (err, files) => {
        //   if (err) throw err;

        //   for (const file of files) {
        //     unlink(path.join(downloadDirectory, file), (err) => {
        //       if (err) throw err;
        //     });
        //   }
        // });
        // console.log(`After... ${Date.now() - now}ms\n`)
      }),
    );
  }
}
