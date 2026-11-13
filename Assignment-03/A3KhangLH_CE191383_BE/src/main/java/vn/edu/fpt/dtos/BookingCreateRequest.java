package vn.edu.fpt.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class BookingCreateRequest {
    // For staff booking on behalf of a customer, customerID can be provided;
    // for logged in customer, it will be automatically inferred from token!
    private Integer customerID;

    @NotEmpty(message = "At least one room must be selected")
    @Valid
    private List<BookingItemRequest> items;

    public BookingCreateRequest() {
    }

    public Integer getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Integer customerID) {
        this.customerID = customerID;
    }

    public List<BookingItemRequest> getItems() {
        return items;
    }

    public void setItems(List<BookingItemRequest> items) {
        this.items = items;
    }
}

