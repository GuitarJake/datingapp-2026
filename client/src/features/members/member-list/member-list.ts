import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../types/member';
import { MemberCard } from '../member-card/member-card';
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  private memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updateParams = new MemberParams();

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = JSON.parse(filters);
      this.updateParams = JSON.parse(filters);
    }
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.paginatedMembers.set(result);
      }
    });
  }

  onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    console.log('Modal closed');
    
    // this.modal.close();
  }

  onFilterChange(data: MemberParams) {
    console.log('Modal submitted data', data);
    this.memberParams = {...data};
    this.updateParams = {...data};
    this.loadMembers();
  }  

  resetFilters() {
    this.memberParams = new MemberParams();
    console.log('**member', this.updateParams);
    this.updateParams = new MemberParams();
    console.log('update', this.updateParams);
    this.loadMembers();
  }

  get DisplayMessage() : string {
    const defaultParams = new MemberParams();

    const filters: string[] = [];
    if (this.updateParams.gender) {
      filters.push(this.updateParams.gender + 's')
    } else {
      filters.push('Males, Females');
    }
    if (this.updateParams.minAge !== defaultParams.minAge || this.updateParams.maxAge !== defaultParams.maxAge) {
      filters.push(`ages ${this.updateParams.minAge}-${this.updateParams.maxAge}`)
    }

    filters.push(this.updateParams.orderBy ==='lastActive' ? 'Recently active' : 'Newest members');

    return filters.length > 0 ? `Selected: ${filters.join('  | ')}` : 'All members';
  }
}
