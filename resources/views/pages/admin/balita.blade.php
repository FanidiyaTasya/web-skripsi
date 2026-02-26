@extends('layouts.admin')

@section('content')
<div class="container-fluid">

    <div class="card shadow-sm">
        <div class="card-body">

            {{-- HEADER --}}
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-semibold mb-0">Data Balita</h5>

                <a href="{{ route('children.create') }}" class="btn btn-primary">
                    <i class="ti ti-plus"></i> Tambah Balita
                </a>
            </div>

            {{-- SEARCH --}}
            <form method="GET" class="mb-3">
                <div class="input-group w-50">
                    <input type="text"
                           name="search"
                           value="{{ request('search') }}"
                           class="form-control"
                           placeholder="Cari Nama / NIK Balita...">

                    <button class="btn btn-outline-primary">
                        Search
                    </button>
                </div>
            </form>

            {{-- TABLE --}}
            <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">

                    <thead class="table-primary text-center">
                        <tr>
                            <th width="5%">#</th>
                            <th>NIK</th>
                            <th>Nama</th>
                            <th>Jenis Kelamin</th>
                            <th>Tanggal Lahir</th>
                            <th>Posyandu</th>
                            <th width="18%">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse($children as $index => $c)
                            <tr>
                                <td class="text-center">
                                    {{ $children->firstItem() + $index }}
                                </td>

                                <td>{{ $c->child_nik }}</td>
                                <td>{{ $c->name }}</td>

                                <td class="text-center">
                                    @if($c->gender == 1)
                                        <span class="badge bg-info">Laki-laki</span>
                                    @else
                                        <span class="badge bg-danger">Perempuan</span>
                                    @endif
                                </td>

                                <td class="text-center">
                                    {{ \Carbon\Carbon::parse($c->birth_date)->format('d M Y') }}
                                </td>

                                <td>{{ $c->posyandu ?? '-' }}</td>

                                <td class="text-center">

                                    <a href="{{ route('children.show', $c->id) }}"
                                       class="btn btn-info btn-sm">
                                        Detail
                                    </a>

                                    <a href="{{ route('children.edit', $c->id) }}"
                                       class="btn btn-warning btn-sm">
                                        Edit
                                    </a>

                                    <form action="{{ route('children.destroy', $c->id) }}"
                                          method="POST"
                                          class="d-inline">
                                        @csrf
                                        @method('DELETE')

                                        <button class="btn btn-danger btn-sm"
                                                onclick="return confirm('Hapus data balita?')">
                                            Hapus
                                        </button>
                                    </form>

                                </td>
                            </tr>

                        @empty
                            <tr>
                                <td colspan="8" class="text-center text-muted">
                                    Data balita tidak ditemukan
                                </td>
                            </tr>
                        @endforelse
                    </tbody>

                </table>
            </div>

            {{-- PAGINATION --}}
            <div class="mt-3">
                {{ $children->links() }}
            </div>

        </div>
    </div>
</div>
@endsection