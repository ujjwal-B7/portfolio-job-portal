import { Controller, Get } from '@nestjs/common';
import { VisitorService } from './visitor.service';

@Controller('visitors')
export class VisitorController {
  constructor(private visitorService: VisitorService) {}

  @Get('/count')
  async increaseVisitorCount(): Promise<number> {
    return this.visitorService.increaseVisitorCount();
  }
}
