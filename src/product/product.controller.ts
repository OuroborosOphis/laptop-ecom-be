import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common"
import { ProductService } from "./product.service"
import { ProductDto } from "./product.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import * as path from 'path'
import {v4 as uuidv4} from 'uuid'
import { diskStorage } from "multer"
import {join} from 'path'
import * as qr from 'qrcode'
import { OrderDto } from "src/order/dto/order.dto"
@Controller('product')
export class  ProductController {
    constructor(private readonly productService:ProductService) {}

    @Post('/create')
    async createProduct(@Body() product:ProductDto):Promise<any> {
        return await this.productService.createProduct(product)
    }

    @Put('/update/:id')
    async updateProduct(@Body() product:ProductDto,@Param('id') id:string):Promise<any> {
        return await this.productService.updateProduct(Number(id),product)
    }

    @Delete('/delete/:id')
    async softDeleteProduct(@Param('id') id:string):Promise<any> {
        return await this.productService.softDeleteProduct(Number(id))
    }

    @Get('/findProduct/:id')
    async findProductById(@Param('id') id:string):Promise<any> {
        return await this.productService.findProductById(Number(id))
    }

    @Get()
    async paginate(
        @Query('page') page:string,
        @Query('limit') limit:string,
        @Query('productName') productName:string,
        @Query('minPrice') minPrice:string,
        @Query('maxPrice') maxPrice:string,
        @Query('order') order: string = 'ASC'  // Mặc định là ASC nếu không có tham số order
    ) {
        // th1 không truyền tham số gì
        if(!productName && !minPrice && !maxPrice) return await this.productService.paginateProduct({page:Number(page) ?? 1,limit:Number(limit) ?? 5,route:'http://localhost:3000/product'})
        // th2 tìm theo tên
        else if(!minPrice && !maxPrice) return await this.productService.paginateProductByName({page:Number(page) ?? 1,limit:Number(limit) ?? 5,route:'http://localhost:3000/product'},productName)
        // th3 tìm theo khoảng giá
        else if(!productName) return await this.productService.paginateProductByPriceRange({page:Number(page) ?? 1,limit:Number(limit) ?? 5,route:'http://localhost:3000/product'},Number(minPrice),Number(maxPrice),order)
        // th4 tìm theo tên và khoảng giá
        else return await this.productService.paginateProductByPriceRangeAndName({page:Number(page) ?? 1,limit:Number(limit) ?? 5,route:'http://localhost:3000/product'},productName,Number(minPrice),Number(maxPrice),order)
    }

    // xử lý file ảnh uplod 
    @Post('/uploadImage/:id')
    @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
        destination: './uploads/productImage',
        filename: (req, file, cb) => {  
            const fileName = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
            const extention = path.parse(file.originalname).ext
            cb(null, `${fileName}${extention}`)
        }
    })
}))
    async uploadfile(@UploadedFile() file: Express.Multer.File,@Param('id') id:string ) {
        console.log(file);
        console.log(path.parse(file.originalname))

        const foundProduct = await this.productService.findProductById(Number(id))
        if(!foundProduct) return 'id sản phẩm không hợp lệ'

        return await this.productService.updateProduct(Number(id),{imageUrl:file.filename})

    }

    @Get('/findProductImage/:id')
    async findProductImage(@Param('id') id:string, @Res() res):Promise<any> {
        const foundProduct = await this.productService.findProductById(Number(id))
        if(!foundProduct) return 'product id not found'
        return await res.sendFile(join(process.cwd(),`/uploads/productImage/${foundProduct.imageUrl}`))
    }
 
}