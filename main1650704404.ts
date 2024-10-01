interface Book {
    id: number;
    title: string;
    author: string;
    genre: Genre;
    publishedYear: number;
}

enum Genre {
    Fiction,
    NonFiction,
    Fantasy,
    Learning,
}

interface AvailableBook extends Book {
    availability: "available";
}

interface CheckedOutBook extends Book {
    availability: "checked out";
    dueDate?: string;
}

type BookState = AvailableBook | CheckedOutBook;

class Library<U extends BookState> {
    private inventory: U[] = [];

    AddBook(book: U): void {
        if (this.inventory.find(b => b.id === book.id)) {
            return console.log(`Book with ID ${book.id} already exists in the inventory.`);
        }
        this.inventory.push(book);
        console.log(`${book.title} by ${book.author} has been added to inventory.`);
    }

    ListBooks(): void {
        if (this.inventory.length === 0) {
            return console.log("No books in inventory now.");
        }
        console.log("Listing all books in the inventory:");
        this.inventory.forEach(book => {
            console.log(`${book.id}, title: ${book.title}, author: ${book.author}`);
        });
    }

    searchBook<k extends keyof U>(key: k, value: U[k]): U[] {
        return this.inventory.filter(book => book[key] === value);
    }

    updateBook(id: number, update: Partial<U>): void {
        const book = this.inventory.find(b => b.id === id);
        if (!book) {
            return console.log(`Book with ID ${id} not found.`);
        }
        Object.assign(book, update);
        console.log(`The book with ID ${id} has been updated.`);
    }

    deleteBook(id: number): void {
        const index = this.inventory.findIndex(book => book.id === id);
        if (index !== -1) {
            this.inventory.splice(index, 1);
            console.log(`The book with ID ${id} has been deleted.`);
        } else {
            console.log(`Book with ID ${id} not found.`);
        }
    }

    checkoutBook(id: number, dueDate: string): void {
        const index = this.inventory.findIndex(book => book.id === id);
        if (index !== -1 && this.inventory[index].availability === "available") {
            const checkedOutBook: CheckedOutBook = {
                ...this.inventory[index],
                availability: "checked out",
                dueDate,
            };
            this.inventory[index] = checkedOutBook as U;
            console.log(`Book with ID ${id} has been checked out and is due on ${dueDate}.`);
        } else {
            console.log(`Book with ID ${id} is not available for checkout.`);
        }
    }

    returnBook(id: number): void {
        const index = this.inventory.findIndex(book => book.id === id);
        if (index !== -1 && this.inventory[index].availability === "checked out") {
            const availableBook: AvailableBook = {
                ...this.inventory[index],
                availability: "available",
            };
            this.inventory[index] = availableBook as U;
            console.log(`Book with ID ${id} has been returned and is now available.`);
        } else {
            console.log(`Book with ID ${id} is either not checked out or not found.`);
        }
    }
}

// Usage Example
const library = new Library<BookState>();

library.AddBook({
    id: 1,
    title: "ว้าวซ่ากับนายกล้วย",
    author: "กล้วยหอมสายฟ้า",
    genre: Genre.Fantasy,
    publishedYear: 2010,
    availability: "available",
});

library.AddBook({
    id: 2,
    title: "สายไฟฟาด",
    author: "นายแว่นมหัศจรรย์",
    genre: Genre.Fiction,
    publishedYear: 2011,
    availability: "available",
});

library.AddBook({
    id: 3,
    title: "อิอิอิอิ",
    author: "คิคิคิคิ",
    genre: Genre.Learning,
    publishedYear: 2016,
    availability: "checked out",
});

library.ListBooks();
library.updateBook(1, { title: "สายไฟฟาด" });
library.ListBooks();
const searchResult = library.searchBook("title", "ว้าวซ่ากับนายกล้วย");
console.log("Books found by title:", searchResult);
library.deleteBook(4);
library.ListBooks();
library.checkoutBook(1, "2024-10-01");
library.ListBooks();
library.returnBook(1);
library.returnBook(2);
library.ListBooks();