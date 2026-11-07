import {
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import * as cheerio from 'cheerio';
import { APIRequestContext, request } from 'playwright';

@Injectable()
export class PlaywrightService implements OnModuleDestroy {
  private readonly logger = new Logger(PlaywrightService.name);
  private requestContext: APIRequestContext | null = null;
  private requestContextPromise: Promise<APIRequestContext> | null = null;

  async onModuleDestroy(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
      this.requestContext = null;
    }
  }

  async fetchHtml(url: string, formData: Record<string, string>): Promise<string> {
    const context = await this.ensureRequestContext();
    const response = await context.post(url, { form: formData });

    if (!response.ok()) {
      throw new Error(`HTTP_${response.status()}`);
    }

    return response.text();
  }

  async fetchAspNetForm(
    url: string,
    fields: Record<string, string>,
  ): Promise<string> {
    const context = await this.ensureRequestContext();
    const initialResponse = await context.get(url);

    if (!initialResponse.ok()) {
      throw new Error(`HTTP_${initialResponse.status()}`);
    }

    const initialHtml = await initialResponse.text();
    const $ = cheerio.load(initialHtml);
    const formData: Record<string, string> = {
      __VIEWSTATE: String($('#__VIEWSTATE').val() ?? ''),
      __VIEWSTATEGENERATOR: String($('#__VIEWSTATEGENERATOR').val() ?? ''),
      __EVENTVALIDATION: String($('#__EVENTVALIDATION').val() ?? ''),
      ...fields,
    };

    const response = await context.post(url, { form: formData });

    if (!response.ok()) {
      throw new Error(`HTTP_${response.status()}`);
    }

    return response.text();
  }

  private ensureRequestContext(): Promise<APIRequestContext> {
    if (this.requestContext) {
      return Promise.resolve(this.requestContext);
    }

    if (!this.requestContextPromise) {
      this.requestContextPromise = request
        .newContext({
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        })
        .then((context) => {
          this.requestContext = context;
          this.logger.log('Cliente HTTP de Playwright listo');
          return context;
        })
        .catch((error) => {
          this.requestContextPromise = null;
          throw error;
        });
    }

    return this.requestContextPromise;
  }
}
