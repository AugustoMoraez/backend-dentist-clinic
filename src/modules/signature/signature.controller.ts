import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignatureService } from './signature.service';


@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

}
