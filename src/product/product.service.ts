import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./product.entity";
import { Between, Like, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductDto } from "./product.dto";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class ProductService {
    constructor(@InjectRepository(ProductEntity)
                private readonly productRepository:Repository<ProductEntity>
            ){}

    async createProduct(product:ProductDto):Promise<any> {
        const newProduct = new ProductEntity()
        newProduct.name = product?.name ?? ''
        newProduct.price = product?.price ?? 0
        newProduct.description = product?.description ?? ''
        newProduct.addedProperty = product?.addedProperty ?? {}
        newProduct.imageUrl = 'testingimageurl.123'
        newProduct.sold = product?.sold ?? 0
        newProduct.countInStock = product?.countInStock ?? 0

        return await this.productRepository.save(newProduct)
    }

    async findProductById(id:number):Promise<any> {
        return await this.productRepository.findOne({where:{id}})
    }

    async findProductByName(name:string):Promise<any> {
        return await this.productRepository.findOne({where:{name}})
    }
    async updateProduct(id:number,options:ProductDto):Promise<any>{
        return await this.productRepository.update(id,options)
    }

    async softDeleteProduct(id:number):Promise<any> {
        return await this.productRepository.softDelete(id)
    }
    // phân trang
    // phân trang bình thường k truyền tham số gì
    async paginateProduct(options:IPaginationOptions):Promise<Pagination<ProductDto>> {
        return await paginate<ProductDto>(this.productRepository,options)
    }

    // phân trang theo tên sản phẩm
    async paginateProductByName(options:IPaginationOptions,name:string):Promise<any> {
        const productArray = await this.productRepository.findAndCount({
            take:Number(options.limit),
            skip:(Number(options.page)-1) * Number(options.limit),
            order:{id:'ASC'},
            where: [
                { name:Like(`%${name}%`) }
            ]
        })
        // [
        //     [
        //         {
        //             "id": 2,
        //             "name": "tho",
        //             "price": "10001",
        //             "description": "rat ngon rat tuyet voi",
        //             "imageUrl": "testingimageurl.123",
        //             "addedProperty": {
        //                 "size": "small",
        //                 "color": "green"
        //             },
        //             "createdAt": "2025-05-08T16:12:49.355Z",
        //             "updatedAt": "2025-05-08T16:12:49.355Z",
        //             "deletedAt": null
        //         },
        //         {
        //             "id": 13,
        //             "name": "tho1",
        //             "price": "10009",
        //             "description": "khong ngon ti nao",
        //             "imageUrl": "testingimageurl.123",
        //             "addedProperty": {
        //                 "size": "small",
        //                 "color": "green"
        //             },
        //             "createdAt": "2025-05-08T16:40:18.126Z",
        //             "updatedAt": "2025-05-08T16:40:18.126Z",
        //             "deletedAt": null
        //         }
        //     ],
        //     2
        // ]
        const products = productArray[0]
        const totalProducts = productArray[1]
        
        const productPageable:Pagination<ProductDto> = {
              items:products,
              meta: {
                totalItems: totalProducts,
                itemCount: products.length,
                itemsPerPage: Number(options.limit),
                totalPages: Math.ceil(totalProducts / Number(options.limit)),
                currentPage: Number(options.page)
              },
              links: {
                first:options.route + `?limit=${options.limit}` + `&productName=${name}`,
                previous:Number(options.page) > 1 ? options.route + `?page=${Number(options.page)-1}` + `&limit=${options.limit}`+ `&productName=${name}` : '',
                next: options.route + `?page=${Number(options.page)+1}` + `&limit=${options.limit}` + `&productName=${name}`,
                last:options.route + `?page=${Math.ceil(totalProducts/Number(options.limit))}` + `&productName=${name}`
              }
            }
            return productPageable
    }

    // phân trang theo giá sản phẩm 
    // phân trang dựa trên khoảng giá
    
    async paginateProductByPriceRange(options:IPaginationOptions,minPrice:number,maxPrice:number,order:string):Promise<any> {
        const orderUpperCase = order.toUpperCase()// xử lý trường hợp ng dùng truyền chuỗi thường
        // tham số của order chỉ nhận asc của desc do nest cung cấp nên cần 1 bước trung gian order k đc là chuỗi nào khác ngoài 2 chuỗi này
        if (orderUpperCase !== 'ASC' && orderUpperCase !== 'DESC') {
            throw new Error('Order must be either ASC or DESC');
        }
        const productArray = await this.productRepository.findAndCount({
            take:Number(options.limit),
            skip:(Number(options.page)-1)*Number(options.limit),
            order:{price:orderUpperCase}, 
            where: [
                {price:Between(minPrice,maxPrice)}
            ]
        })
        const products = productArray[0]
        const totalProducts = productArray[1]
    
        const productPageable: Pagination<ProductDto> = {
            items: products,
            meta: {
                totalItems: totalProducts,
                itemCount: products.length,
                itemsPerPage: Number(options.limit),
                totalPages: Math.ceil(totalProducts / Number(options.limit)),
                currentPage: Number(options.page)
            },
            links: {
                first: options.route + `?limit=${options.limit}` + `&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${orderUpperCase}`,
                previous: Number(options.page) > 1 ? options.route + `?page=${Number(options.page) - 1}` + `&limit=${options.limit}` + `&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${orderUpperCase}` : '',
                next: options.route + `?page=${Number(options.page) + 1}` + `&limit=${options.limit}` + `&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${orderUpperCase}`,
                last: options.route + `?page=${Math.ceil(totalProducts / Number(options.limit))}` + `&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${orderUpperCase}`
            }
        }
        return productPageable
    }

    // phân trang dựa trên tên và khoảng giá
    async paginateProductByPriceRangeAndName(options:IPaginationOptions,productName:string,minPrice:number,maxPrice:number,order:string):Promise<any> {
        const orderUpperCase = order.toUpperCase()// xử lý trường hợp ng dùng truyền chuỗi thường
        // tham số của order chỉ nhận asc của desc do nest cung cấp nên cần 1 bước trung gian order k đc là chuỗi nào khác ngoài 2 chuỗi này
        if (orderUpperCase !== 'ASC' && orderUpperCase !== 'DESC') {
            throw new Error('Order must be either ASC or DESC');
        }
        const productArray = await this.productRepository.findAndCount({
            take:Number(options.limit),
            skip:(Number(options.page)-1)*Number(options.limit),
            order:{price:orderUpperCase}, 
            where: [
                {
                    name: Like(`%${productName}%`), 
                    price:Between(minPrice,maxPrice)
                }
            ]
        })
        const products = productArray[0]
        const totalProducts = productArray[1]
    
        const productPageable: Pagination<ProductDto> = {
            items: products,
            meta: {
                totalItems: totalProducts,
                itemCount: products.length,
                itemsPerPage: Number(options.limit),
                totalPages: Math.ceil(totalProducts / Number(options.limit)),
                currentPage: Number(options.page)
            },
            links: {
                first: options.route + `?limit=${options.limit}` + `&name=${productName}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${orderUpperCase}`,
                previous: Number(options.page) > 1 ? options.route + `?page=${Number(options.page) - 1}` + `&limit=${options.limit}` + `&name=${productName}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${orderUpperCase}` : '',
                next: options.route + `?page=${Number(options.page) + 1}` + `&limit=${options.limit}` + `&name=${productName}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${orderUpperCase}`,
                last: options.route + `?page=${Math.ceil(totalProducts / Number(options.limit))}` + `&name=${productName}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${orderUpperCase}`
            }
        }
        return productPageable
    }
}