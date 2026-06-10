package com.finance.dtos;

import java.time.LocalDate;

import com.finance.models.FundCategory;

public record FundDto(String name, String ticker, FundCategory category, Double expenseRatio, Double nav, String manager,
        LocalDate inceptionDate) {

}
