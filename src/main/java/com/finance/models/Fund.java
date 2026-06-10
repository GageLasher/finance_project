package com.finance.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fund")
public class Fund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "ticker", nullable = false, unique = true)
    private String ticker;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private FundCategory category;

    @Column(name = "expense_ratio", nullable = false)
    private Double expenseRatio;

    @Column(name = "nav", nullable = false)
    private Double nav;

    @Column(name = "manager", nullable = false)
    private String manager;

    @Column(name = "inception_date", nullable = false)
    private LocalDate inceptionDate;

    public Fund() {
    }

    public Fund(Integer id, String name, String ticker, FundCategory category, Double expenseRatio, Double nav,
            String manager, LocalDate inceptionDate) {
        this.id = id;
        this.name = name;
        this.ticker = ticker;
        this.category = category;
        this.expenseRatio = expenseRatio;
        this.nav = nav;
        this.manager = manager;
        this.inceptionDate = inceptionDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public FundCategory getCategory() {
        return category;
    }

    public void setCategory(FundCategory category) {
        this.category = category;
    }

    public Double getExpenseRatio() {
        return expenseRatio;
    }

    public void setExpenseRatio(Double expenseRatio) {
        this.expenseRatio = expenseRatio;
    }

    public Double getNav() {
        return nav;
    }

    public void setNav(Double nav) {
        this.nav = nav;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public LocalDate getInceptionDate() {
        return inceptionDate;
    }

    public void setInceptionDate(LocalDate inceptionDate) {
        this.inceptionDate = inceptionDate;
    }
    
    
}
