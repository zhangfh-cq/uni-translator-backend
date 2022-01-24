import crypto from 'crypto';

class CryptoTool {
    // 获取加密强伪随机数据
    public static getRandomData(length: number = 32): string {
        return crypto
            .randomBytes(length / 2)
            .toString('hex');
    }
    // 生成哈希摘要
    public static getHashDigest(data: string, algorithm: string = 'sha256'): string {
        return crypto
            .createHash(algorithm)
            .update(data)
            .digest('hex');
    }
}

export default CryptoTool;