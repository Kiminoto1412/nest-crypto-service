import { Controller, Post, Body } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

class EncryptDataDto {
  payload: string;
}

class DecryptDataDto {
  data1: string;
  data2: string;
}

@ApiTags('encryption')
@Controller()
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('get-encrypt-data')
  @ApiBody({ type: EncryptDataDto })
  @ApiResponse({ status: 201, description: 'Encryption successful.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getEncryptData(@Body() encryptDataDto: EncryptDataDto) {
    return this.encryptionService.encryptData(encryptDataDto.payload);
  }

  @Post('get-decrypt-data')
  @ApiBody({ type: DecryptDataDto })
  @ApiResponse({ status: 201, description: 'Decryption successful.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getDecryptData(@Body() decryptDataDto: DecryptDataDto) {
    return this.encryptionService.decryptData(
      decryptDataDto.data1,
      decryptDataDto.data2,
    );
  }
}
