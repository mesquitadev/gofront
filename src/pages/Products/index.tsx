import React, {useEffect, useState} from 'react';
import {api} from '../../services/api';
import {formatPrice} from '../../utils/format';
import {Button, Form, Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import {MdDelete, MdEdit} from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {Container, ProductTable} from "./styles";



interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageURL: string;
    quantity: number;
}

interface ProductFormatted extends Product {
    imageURL: string;
    priceFormatted: string;
}

const Products = (): JSX.Element => {
    const [products, setProducts] = useState<ProductFormatted[]>([]);
    const [show, setShow] = useState(false);
    const [showProductModal, setShowAddProductModal] = useState(false);
    const [showProductEditModal, setShowProductEditModal] = useState(false);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')
    const [data, setData] = useState<Product>()

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const response = await api.get('/products');
        const productsFormatted = response.data.content.map(function (product: Product) {
            return {...product, price: formatPrice(product.price)}
        })
        setProducts(productsFormatted)
    }

    function addProduct() {
        const body = {
            "name": name,
            "description": description,
            "imageURL": imageURL,
            "quantity": quantity,
            "price": price
        }

        return new Promise((resolve, reject) => {
            api.post(`products`, body)
                .then(response => {
                    resolve(response)
                    handleShowModal()
                    toast('Adicionado')
                })
                .catch((err) => reject(err))
        })
    }

    async function handleRemoveProduct(id: number) {
        confirmAlert({
            title: 'Confirme para deletar',
            message: `Voce tem certeza que quer deletar o produto de id ${id}?`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        return new Promise((resolve, reject) => {
                            api.delete(`products/${id}`)
                                .then(response => {
                                    resolve(response)
                                    loadProducts()
                                    toast('Deletado com sucesso!')
                                })
                                .catch((err) => reject(err))
                        })
                    }
                }
            ]
        });


    }

    const handleModal = () => setShow(state => !state);

    const handleShowModal = () => setShowAddProductModal(state => !state)

    function handleEditProductModal(id: number) {
        return new Promise((resolve, reject) => {
            api.get(`products/${id}`)
                .then(response => {
                    resolve(response)
                    handleShowModal(response.data)

                })
                .catch((err) => reject(err))
        })
    }

    return (
        <>
            <Container>
                <Button onClick={handleShowModal}>
                    Adicionar Produto
                </Button>
                <ProductTable>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th aria-label="product image">Imagem</th>
                        <th>Produto</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Ações</th>
                        <th aria-label="delete icon"/>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr data-testid="product" key={product.id}>
                            <td>{product.id}</td>
                            <td>
                                <img src={product.imageURL} alt={product.name}/>
                            </td>
                            <td>
                                <strong>{product.name}</strong>
                            </td>
                            <td>
                                {product.description}
                            </td>
                            <td>
                                <strong>{product.price}</strong>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    data-testid="remove-product"
                                    onClick={() => handleRemoveProduct(product.id)}
                                >
                                    <MdDelete size={20}/>
                                </button>
                                <button
                                    type="button"
                                    data-testid="remove-product"
                                    onClick={() => handleEditProductModal(product.id)}
                                >
                                    <MdEdit size={20}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </ProductTable>
            </Container>
            <Modal show={show} onHide={handleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleModal}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showProductModal} onHide={handleShowModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Produto</Form.Label>
                            <Form.Control type="text" placeholder="Nome do produto" required
                                          onChange={event => setName(event.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control type="text" placeholder="Descrição" required
                                          onChange={event => setDescription(event.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Imagem</Form.Label>
                            <Form.Control type="text" placeholder="Url da Imagem" required
                                          onChange={event => setImageURL(event.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control type="text" placeholder="Preço do produto" required
                                          onChange={event => setPrice(event.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control type="number" placeholder="Quantidade no Estoque" required
                                          onChange={event => setQuantity(event.target.value)}/>
                        </Form.Group>

                        <Button variant="primary" onClick={addProduct}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showProductEditModal} onHide={handleShowModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Produto</Form.Label>
                            <Form.Control type="text" placeholder="Nome do produto" required
                                          onChange={event => setName(event.target.value)} value={data?.name}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control type="text" placeholder="Descrição" required
                                          onChange={event => setDescription(event.target.value)} value={data?.description} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Imagem</Form.Label>
                            <Form.Control type="text" placeholder="Url da Imagem" required
                                          onChange={event => setImageURL(event.target.value)} value={data?.imageURL} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control type="text" placeholder="Preço do produto" required
                                          onChange={event => setPrice(event.target.value)} value={data?.price}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control type="number" placeholder="Quantidade no Estoque" required
                                          onChange={event => setQuantity(event.target.value)} value={data?.quantity}/>
                        </Form.Group>

                        <Button variant="primary" onClick={addProduct}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Products;
