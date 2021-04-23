/* eslint-disable no-param-reassign */
import { JSEncrypt } from 'jsencrypt';
import ByteBuffer from 'bytebuffer';

const KEY_PREFIX_START_BYTE = 1;
const VERSION_END_MARKER = '!';
const DEFAULT_IMPLEMENTATION_VERSION = 1;

class RsaEncrypt {
  constructor(
    publicKeyValue,
    publicKeyId,
    cryptoVersion = DEFAULT_IMPLEMENTATION_VERSION
  ) {
    this.publicKeyValue = publicKeyValue;
    this.publicKeyId = publicKeyId;
    this.cryptoVersion = cryptoVersion;

    this.validate();
  }

  encrypt(plaintext) {
    if (!plaintext) {
      throw new Error('Plaintext to encrypt must be specified.');
    }

    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(this.publicKeyValue);

    const ciphertext = jsEncrypt.encrypt(plaintext);
    if (!ciphertext) {
      throw new Error('Has a valid PEM encoded public key been specified?');
    }

    const keyPrefixedAndEncrypted = this.addKeyVersionPrefix(ciphertext);

    return this.cryptoVersion + VERSION_END_MARKER + keyPrefixedAndEncrypted;
  }

  buildKeyPrefix() {
    return new ByteBuffer()
      .writeByte(KEY_PREFIX_START_BYTE)
      .writeInt32(this.publicKeyId)
      .flip();
  }

  addKeyVersionPrefix(ciphertext) {
    return ByteBuffer.concat([
      this.buildKeyPrefix(),
      ByteBuffer.fromBase64(ciphertext),
    ]).toBase64();
  }

  validate() {
    if (!this.publicKeyValue) {
      throw new Error('RSA Public key must be specified.');
    }

    if (!this.publicKeyId) {
      throw new Error('Public key Id must be specified.');
    }

    if (!this.cryptoVersion) {
      throw new Error('Crypto implementation version must be specified.');
    }
  }
}

export default RsaEncrypt;
