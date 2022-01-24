// 自定义异常
class CustomError extends Error {
    private code: number;
    private data: object | Array<object> | null;

    public constructor(code: number, message: string, data: object | Array<object> | null = null) {
        super(message);
        this.code = code;
        this.data = data;
    }

    public getCode(): number {
        return this.code;
    }

    public getMessage(): string {
        return this.message;
    }

    public getData(): object | Array<object> | null {
        return this.data;
    }

    public getName(): string {
        return this.name;
    }

    public getTrace(): string | undefined {
        return this.stack;
    }
}

export default CustomError;